import emailjs from "emailjs-com";

// EmailJS configuration
const SERVICE_ID = "service_l9s6vwr"; // Your Gmail Service ID
const QUERY_TEMPLATE_ID = "template_td3uvm9"; // Your Query Template ID
const AUTO_REPLY_TEMPLATE_ID = "template_lariw3a"; // Auto-Reply Template ID
const PUBLIC_KEY = "l9y3q9BCYB23utBZg"; // Your Public Key

interface FormData {
  name: string;
  email: string;
  message: string;
}

export const sendQueryEmail = async (formData: FormData): Promise<void> => {
  try {
    await emailjs.send(
      SERVICE_ID,
      QUERY_TEMPLATE_ID,
      {
        from_name: formData.name,
        from_email: formData.email, // For display in the email body
        message: formData.message,
        to_email: "saink4831@gmail.com", // The recipient of the query email
        reply_to: formData.email, // Add reply-to field for user response
      },
      PUBLIC_KEY
    );
    console.log("Query email sent successfully to saink4831@gmail.com!");
    console.log("Sent with to_email:", "saink4831@gmail.com", "reply_to:", formData.email);
  } catch (error) {
    console.error("Failed to send query email:", error);
    throw new Error("Failed to send query email");
  }
};

export const sendAutoReplyEmail = async (formData: FormData): Promise<void> => {
  try {
    console.log("Sending auto-reply to:", formData.email); // Debug log
    await emailjs.send(
      SERVICE_ID,
      AUTO_REPLY_TEMPLATE_ID,
      {
        to_name: formData.name, // Name of the user receiving the auto-reply
        to_email: formData.email, // The user's email (recipient of the auto-reply)
        from_name: "Suresh Kumar", // Sender name (you)
        message: formData.message, // Include the user's message in the auto-reply
      },
      PUBLIC_KEY
    );
    console.log(`Auto-reply email sent successfully to ${formData.email}!`);
  } catch (error) {
    console.error("Failed to send auto-reply email:", error);
    throw new Error("Failed to send auto-reply email");
  }
};

export const sendContactEmails = async (formData: FormData): Promise<void> => {
  await sendQueryEmail(formData);
  await sendAutoReplyEmail(formData);
};