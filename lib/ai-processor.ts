export async function processVoiceToText(audioBlob: Blob): Promise<string> {
  // Mock AI voice processing - in production, integrate with speech-to-text API
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTranscriptions = [
        "My car's engine is making a strange rattling noise when I start it in the morning",
        "The brake pedal feels spongy and the car takes longer to stop than usual",
        "AC is not cooling properly and making weird sounds",
        "Strange vibration in steering wheel at high speeds",
        "Engine light came on yesterday and the car feels sluggish"
      ];
      const randomText = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      resolve(randomText);
    }, 2000);
  });
}

export async function formatIssueWithAI(text: string, vehicleModel: string): Promise<{
  formattedIssue: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  suggestedActions: string[];
}> {
  // Mock AI formatting - in production, integrate with OpenAI or similar
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories = ['Engine', 'Brakes', 'Electrical', 'AC/Heating', 'Suspension', 'Transmission'];
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      const severityMap = {
        'brake': 'high',
        'engine': 'medium',
        'electrical': 'medium',
        'ac': 'low',
        'suspension': 'medium'
      } as const;
      
      const textLower = text.toLowerCase();
      let severity: 'low' | 'medium' | 'high' = 'low';
      
      if (textLower.includes('brake') || textLower.includes('stop')) severity = 'high';
      else if (textLower.includes('engine') || textLower.includes('transmission')) severity = 'medium';
      else severity = 'low';
      
      const suggestedActions = [
        'Schedule inspection with authorized Tata service center',
        'Check warranty coverage for this issue',
        'Document any unusual sounds or behaviors',
        'Avoid heavy driving until resolved'
      ];
      
      resolve({
        formattedIssue: `${vehicleModel} - ${text.charAt(0).toUpperCase() + text.slice(1)}`,
        category,
        severity,
        suggestedActions
      });
    }, 1500);
  });
}