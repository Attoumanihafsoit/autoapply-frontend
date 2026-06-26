
export interface OcrResult {
  text: string;
  data: Record<string, string>;
}

const API_BASE_URL = 'http://localhost:8080/api/onboarding';

export const ocrService = {
  uploadDocument: async (applicationId: string, file: File, type: 'ID_FRONT' | 'ID_BACK'): Promise<OcrResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    // TODO: Connect to real backend
    // const response = await fetch(`${API_BASE_URL}/${applicationId}/documents`, {
    //   method: 'POST',
    //   body: formData,
    // });
    // if (!response.ok) throw new Error('Upload failed');
    // return response.json();

    // MOCK RESPONSE FOR DEMO
    console.log(`Uploading ${type}...`, file.name);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          text: "MOCKED OCR TEXT",
          data: {
            firstName: "Amadou",
            lastName: "Diallo",
            idNumber: "1234567890123",
            dateOfBirth: "1990-05-15",
            placeOfBirth: "Dakar",
            nationality: "senegalese",
            address: "Sicap Amitié 2, Villa 123",
            idIssueDate: "2020-01-01",
            idExpiryDate: "2030-01-01",
            idIssuePlace: "Dakar",
            idType: "cni"
          }
        });
      }, 1500);
    });
  }
};
