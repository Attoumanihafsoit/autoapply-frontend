
export interface OcrResult {
  text: string;
  data: Record<string, string>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const ocrService = {

  uploadDocument: async (
    applicationId: string,
    documentIdentite: File, // CNI ou passeport
    selfieImage: File | undefined,

    clientData: {
  civility?: string;
  lastName?: string;
  firstName?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  nationality?: string;
  phone?: string;
  email?: string;
  address?: string;
  postalAddress?: string;
  selfieFile?: File;
}
  ): Promise<OcrResult> => {

    const formData = new FormData();
    // Informations client venant du formulaire
    formData.append('tenant_id', 'BIMAO-001');
    formData.append('civilite', clientData.civility ?? '');
   formData.append('nom', clientData.lastName ?? '');
formData.append('prenom', clientData.firstName ?? '');
formData.append('date_naissance', clientData.dateOfBirth ?? '');
formData.append('lieu_naissance', clientData.placeOfBirth ?? '');
formData.append('nationalite', clientData.nationality ?? '');
formData.append('telephone', clientData.phone ?? '');
formData.append('email', clientData.email ?? '');
formData.append('adresse', clientData.address ?? '');
formData.append('adresse_postale', clientData.postalAddress ?? '');

 // Document identité (CNI ou passeport)
formData.append(
  "id_front_image",
  documentIdentite
);

// Selfie KYC
if (selfieImage) {
  formData.append(
    "selfie_image",
    selfieImage
  );
}

    // DEBUG
    console.log("CLIENT DATA :", clientData);
console.log(clientData);
    console.log("FORMDATA ENVOYE :");



for (const pair of formData.entries()) {
  if (pair[1] instanceof File) {
    console.log(
      pair[0],
      "=>",
      pair[1].name,
      pair[1].type,
      pair[1].size
    );
  } else {
    console.log(pair[0], "=>", pair[1]);
  }
}

console.log("========== ENVOI API OCR ==========");
console.log("API_BASE_URL =", API_BASE_URL);



const response = await fetch(
  `${API_BASE_URL}/customer/register`,
  {
    method: "POST",
    body: formData,
  }
);
if (!response.ok) {

 const errorText = await response.text();

 console.error(
   "Erreur backend:",
   errorText
 );

 throw new Error(errorText);

}

const result = await response.json();

console.log("REPONSE BACKEND :", result);

return result;

  }
};