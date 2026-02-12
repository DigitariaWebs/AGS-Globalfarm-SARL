"use server";

import { sendEmail } from "@/lib/email";
import ContactEmail from "@/emails/ContactEmail";
import type { ContactFormData } from "@/types";

export async function sendContactEmail(formData: ContactFormData) {
  try {
    // Validate required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      return {
        success: false,
        error: "Tous les champs requis doivent être remplis.",
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        error: "Veuillez fournir une adresse email valide.",
      };
    }

    // Get admin email from environment variables
    const adminEmail = process.env.STORE_EMAIL;
    if (!adminEmail) {
      console.error("STORE_EMAIL environment variable is not set");
      return {
        success: false,
        error:
          "Configuration email manquante. Veuillez contacter l'administrateur.",
      };
    }

    // Send email to admin
    await sendEmail({
      to: adminEmail,
      subject: `Nouveau message de contact - ${formData.name}`,
      template: ContactEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      }),
    });

    return {
      success: true,
      message:
        "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
    };
  } catch (error) {
    console.error("Error sending contact email:", error);
    return {
      success: false,
      error:
        "Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer plus tard.",
    };
  }
}
