import LangflowClient from "./langflow_client/langflowClient.js";

export default async function main(
  inputValue,
  inputType = "chat",
  outputType = "chat",
  stream = false
) {
  const flowIdOrName = "a120bdd0-632d-4ee6-a063-f0f216252e0a";
  const langflowId = "4b2adee2-0c34-4f29-8b9a-ff1d573c8a03";
  const applicationToken = process.env.token;
  const langflowClient = new LangflowClient(
    "https://api.langflow.astra.datastax.com",
    applicationToken
  );

  try {
    const tweaks = {
      "ChatInput-uUi6s": {},
      "Prompt-9yPN9": {},
      "GroqModel-n91pv": {},
      "AstraDB-BJgM8": {},
      "ParseData-N1BXf": {},
      "ChatOutput-y4A36": {},
      "HuggingFaceInferenceAPIEmbeddings-tH0XX": {},
      "File-MpR3h": {},
      "SplitText-Iyful": {},
      "AstraDB-lXeCy": {},
      "HuggingFaceInferenceAPIEmbeddings-MQaOg": {},
    };

    const response = await langflowClient.runFlow(
      flowIdOrName,
      langflowId,
      inputValue,
      inputType,
      outputType,
      (stream = false),
      tweaks,
      (data) => console.log(`Received: ${data.chunk}`), // onUpdate
      (message) => console.log(`Stream Closed: ${message}`), // onClose
      (error) => console.error(`Stream Error: ${error}`) // onError
    );

    if (!stream && response && response.outputs) {
      const flowOutputs = response.outputs[0];
      const firstComponentOutputs = flowOutputs.outputs[0];
      const output = firstComponentOutputs.outputs.message;

      return output.message.text; // Return the final output
    }
  } catch (error) {
    throw new Error(`Main Error: ${error.message}`); // Rethrow error to caller
  }
}
