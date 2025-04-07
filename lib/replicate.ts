/**
 * Utility functions to interact with the Replicate API for U²-Net background removal
 */
import getConfig from 'next/config';

// Get server-side runtime config
const { serverRuntimeConfig } = getConfig();

// U²-Net model on Replicate - Update with actual model ID when deployed
const MODEL_ID = 'danielgatis/rembg:adf11c7e5806af2b9f29d91caecff33a45e1602691f2667604546a8ab7144220';

/**
 * Submits an image to the Replicate U²-Net model for background removal
 * 
 * @param imageBuffer The binary image data as a buffer
 * @param mimeType The mime type of the image (must be jpeg or png)
 * @returns A response with the processed image data
 * @throws Error if the API call fails
 */
export async function removeBackground(imageBuffer: ArrayBuffer, mimeType: string): Promise<Response> {
  // Prepare the image as base64
  const base64Image = Buffer.from(imageBuffer).toString('base64');
  const dataURI = `data:${mimeType};base64,${base64Image}`;
  
  // Prepare the API request to Replicate
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${serverRuntimeConfig.replicateApiToken}`,
    },
    body: JSON.stringify({
      version: MODEL_ID,
      input: {
        image: dataURI,
        // Optional U²-Net parameters
        alpha_matting: true,
        alpha_matting_foreground_threshold: 240,
        alpha_matting_background_threshold: 10,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Replicate API error: ${error.detail || 'Unknown error'}`);
  }

  const prediction = await response.json();
  
  // Poll the prediction status
  const result = await pollPrediction(prediction.id);
  
  // The result.output is a URL to the processed image
  if (!result.output) {
    throw new Error('No output generated from the model');
  }
  
  // Fetch the actual image data
  const imageResponse = await fetch(result.output);
  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch processed image: ${imageResponse.statusText}`);
  }
  
  return imageResponse;
}

/**
 * Polls the prediction status until it completes or fails
 * 
 * @param id The prediction ID to poll
 * @returns The final prediction result
 * @throws Error if polling times out or the prediction fails
 */
async function pollPrediction(id: string, timeout = 20000): Promise<any> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: {
        'Authorization': `Token ${serverRuntimeConfig.replicateApiToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error polling prediction: ${response.statusText}`);
    }
    
    const prediction = await response.json();
    
    if (prediction.status === 'succeeded') {
      return prediction;
    } else if (prediction.status === 'failed') {
      throw new Error(`Prediction failed: ${prediction.error || 'Unknown error'}`);
    }
    
    // Wait a short time before polling again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error('Prediction timed out');
} 