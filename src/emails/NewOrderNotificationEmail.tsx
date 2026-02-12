import { Heading, Text, Section, Hr } from "@react-email/components";
import EmailLayout from "./EmailLayout";
import type { Order, OrderItem, Formation, Product } from "@/types";

interface NewOrderNotificationEmailProps {
  order: Order;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

export default function NewOrderNotificationEmail({
  order,
  customerName,
  customerEmail,
  customerPhone,
}: NewOrderNotificationEmailProps) {
  const hasShippingItems = order.address !== undefined;
  const hasPresentialFormation = order.items.some(
    (item) => "title" in item && item.type === "presentiel",
  );

  return (
    <EmailLayout previewText="Nouvelle commande reçue sur AGS Globalfarm">
      <Heading style={heading}>🎉 Nouvelle Commande Reçue !</Heading>

      <Text style={paragraph}>
        Une nouvelle commande vient d&apos;être confirmée sur la plateforme.
      </Text>

      {/* Customer Information */}
      <Section style={infoBox}>
        <Text style={sectionTitle}>👤 Informations Client</Text>
        <Text style={infoText}>
          <strong>Nom:</strong> {customerName}
        </Text>
        <Text style={infoText}>
          <strong>Email:</strong> {customerEmail}
        </Text>
        {customerPhone && (
          <Text style={infoText}>
            <strong>Téléphone:</strong> {customerPhone}
          </Text>
        )}
      </Section>

      {/* Order Details */}
      <Section style={orderSection}>
        <Text style={sectionTitle}>📋 Détails de la Commande</Text>

        {order.items.map((item, index) => {
          const isFormation = "title" in item;
          const itemName = isFormation
            ? (item as Formation).title
            : (item as Product).name;
          const itemPrice = item.price;
          const quantity = item.quantity;

          return (
            <Section key={index} style={itemContainer}>
              <Text style={itemNameStyle}>
                {isFormation ? "📚" : "🌾"} {itemName}
              </Text>
              <Text style={itemDetails}>
                {isFormation ? "Formation" : "Produit"} - Quantité: {quantity} ×{" "}
                {itemPrice.toLocaleString("fr-FR")} FCFA
              </Text>
              <Text style={itemTotal}>
                Sous-total: {(quantity * itemPrice).toLocaleString("fr-FR")}{" "}
                FCFA
              </Text>
            </Section>
          );
        })}

        <Hr style={divider} />

        <Section style={totalSection}>
          <Text style={totalLabel}>Montant Total:</Text>
          <Text style={totalAmount}>
            {order.totalAmount.toLocaleString("fr-FR")} FCFA
          </Text>
        </Section>

        <Text style={paymentStatus}>
          ✅ Statut du paiement:{" "}
          <strong>
            {order.paymentStatus === "paid"
              ? "PAYÉ"
              : order.paymentStatus.toUpperCase()}
          </strong>
        </Text>
      </Section>

      {/* Presential Formation Info */}
      {hasPresentialFormation && (
        <Section style={formationBox}>
          <Text style={formationTitle}>🎓 Formation(s) Présentielle(s)</Text>
          {order.items
            .filter((item) => "title" in item && item.type === "presentiel")
            .map((item, index) => {
              const formation = item as Formation & OrderItem;
              const session = formation.sessions?.find(
                (s) => s.id === formation.sessionId,
              );

              return (
                <Section key={index} style={formationDetailsBox}>
                  <Text style={formationName}>📖 {formation.title}</Text>
                  {session && (
                    <>
                      <Text style={formationInfo}>
                        📅 <strong>Dates:</strong>{" "}
                        {new Date(session.startDate).toLocaleDateString(
                          "fr-FR",
                        )}{" "}
                        -{" "}
                        {new Date(session.endDate).toLocaleDateString("fr-FR")}
                      </Text>
                      <Text style={formationInfo}>
                        📍 <strong>Lieu:</strong> {session.location}
                      </Text>
                      <Text style={formationInfo}>
                        👥{" "}
                        <strong>
                          Places disponibles avant cette réservation:
                        </strong>{" "}
                        {session.availableSpots}
                      </Text>
                      {formation.address && (
                        <Text style={formationInfo}>
                          🏢 <strong>Adresse:</strong> {formation.address}
                        </Text>
                      )}
                    </>
                  )}
                  <Text style={formationInfo}>
                    👤 <strong>Nombre de places réservées:</strong>{" "}
                    {formation.quantity}
                  </Text>
                </Section>
              );
            })}
          <Text style={alertText}>
            ⚠️ N&apos;oubliez pas de contacter le client pour confirmer sa
            participation et lui fournir les détails pratiques.
          </Text>
        </Section>
      )}

      {/* Shipping Information */}
      {hasShippingItems && order.address && (
        <Section style={shippingBox}>
          <Text style={shippingTitle}>📦 Livraison Requise</Text>
          <Text style={paragraph}>
            Cette commande contient des produits nécessitant une livraison.
          </Text>
          <Section style={addressBox}>
            <Text style={addressTitle}>Adresse de livraison:</Text>
            <Text style={addressText}>{order.address.street}</Text>
            <Text style={addressText}>
              {order.address.postalCode} {order.address.city}
            </Text>
            <Text style={addressText}>{order.address.country}</Text>
          </Section>
          <Text style={alertText}>
            📋 Action requise: Préparez cette commande pour l&apos;expédition et
            contactez le client pour confirmer la livraison.
          </Text>
        </Section>
      )}

      {/* Payment Information */}
      <Section style={paymentBox}>
        <Text style={sectionTitle}>💳 Informations de Paiement</Text>
        <Text style={infoText}>
          <strong>Méthode:</strong> {order.paymentMethod || "Paydunya"}
        </Text>
        {order.paydunyaToken && (
          <Text style={infoText}>
            <strong>Token Paydunya:</strong> {order.paydunyaToken}
          </Text>
        )}
        <Text style={infoText}>
          <strong>Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleString("fr-FR")}
        </Text>
      </Section>

      <Hr style={divider} />

      <Text style={footerNote}>
        Cette notification a été générée automatiquement. Veuillez traiter cette
        commande dans les plus brefs délais.
      </Text>
    </EmailLayout>
  );
}

// Styles
const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#059669",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#374151",
  margin: "16px 0",
};

const sectionTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#111827",
  marginBottom: "12px",
};

const infoBox = {
  backgroundColor: "#f3f4f6",
  padding: "20px",
  borderRadius: "8px",
  margin: "24px 0",
};

const infoText = {
  fontSize: "14px",
  color: "#374151",
  margin: "8px 0",
  lineHeight: "20px",
};

const orderSection = {
  backgroundColor: "#f9fafb",
  padding: "24px",
  borderRadius: "8px",
  border: "2px solid #059669",
  margin: "24px 0",
};

const itemContainer = {
  marginBottom: "16px",
  paddingBottom: "12px",
  borderBottom: "1px solid #e5e7eb",
};

const itemNameStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#111827",
  margin: "4px 0",
};

const itemDetails = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "4px 0",
};

const itemTotal = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#059669",
  margin: "4px 0",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "16px 0",
};

const totalSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "16px",
  padding: "16px",
  backgroundColor: "#ecfdf5",
  borderRadius: "6px",
};

const totalLabel = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#111827",
};

const totalAmount = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#059669",
};

const paymentStatus = {
  fontSize: "14px",
  color: "#059669",
  marginTop: "12px",
  textAlign: "center" as const,
};

const formationBox = {
  backgroundColor: "#fef3c7",
  padding: "20px",
  borderRadius: "8px",
  border: "2px solid #fbbf24",
  margin: "24px 0",
};

const formationTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#92400e",
  marginBottom: "16px",
};

const formationDetailsBox = {
  backgroundColor: "#ffffff",
  padding: "16px",
  borderRadius: "6px",
  marginBottom: "12px",
};

const formationName = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#111827",
  marginBottom: "8px",
};

const formationInfo = {
  fontSize: "14px",
  color: "#374151",
  margin: "6px 0",
  lineHeight: "20px",
};

const shippingBox = {
  backgroundColor: "#dbeafe",
  padding: "20px",
  borderRadius: "8px",
  border: "2px solid #3b82f6",
  margin: "24px 0",
};

const shippingTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1e40af",
  marginBottom: "12px",
};

const addressBox = {
  backgroundColor: "#ffffff",
  padding: "16px",
  borderRadius: "6px",
  margin: "16px 0",
};

const addressTitle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#111827",
  marginBottom: "8px",
};

const addressText = {
  fontSize: "14px",
  color: "#374151",
  margin: "4px 0",
};

const alertText = {
  fontSize: "14px",
  color: "#92400e",
  marginTop: "12px",
  padding: "12px",
  backgroundColor: "#fffbeb",
  borderRadius: "6px",
  fontWeight: "500",
};

const paymentBox = {
  backgroundColor: "#f3f4f6",
  padding: "20px",
  borderRadius: "8px",
  margin: "24px 0",
};

const footerNote = {
  fontSize: "14px",
  color: "#6b7280",
  fontStyle: "italic",
  textAlign: "center" as const,
  marginTop: "24px",
};
