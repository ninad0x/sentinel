import {
  Html, Head, Body, Container, Section,
  Text, Heading, Hr, Link, Preview
} from "@react-email/components"

export interface IncidentEmailParams {
  to: string
  siteName: string
  siteUrl: string
  incidentType: "Global" | "Regional"
  downRegions: string[]
  startedAt: Date
  dashboardUrl: string
  status: "DOWN" | "RESOLVED"
}

export default function IncidentAlertEmail({
  siteName,
  siteUrl,
  incidentType,
  downRegions,
  startedAt,
  dashboardUrl,
  status
}: IncidentEmailParams) {

  const isGlobal = incidentType === "Global"
  const isResolved = status === "RESOLVED"

  return (
    <Html>
      <Head />

      <Preview>
        {isResolved
          ? `${siteName} has recovered`
          : `${siteName} is experiencing a ${incidentType.toLowerCase()} outage`}
      </Preview>

      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container style={{
          maxWidth: "520px",
          margin: "40px auto",
          backgroundColor: "#fff",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          padding: "32px"
        }}>

          {/* Status badge */}
          <Section>
            <Text style={{
              display: "inline-block",
              borderRadius: "99px",
              padding: "4px 12px",
              fontSize: "12px",
              fontWeight: "600",
              backgroundColor: isResolved
                ? "#dcfce7"
                : isGlobal
                  ? "#fee2e2"
                  : "#fef3c7",
              color: isResolved
                ? "#16a34a"
                : isGlobal
                  ? "#dc2626"
                  : "#d97706"
            }}>
              ● {isResolved ? "Resolved" : `${incidentType} Outage`}
            </Text>
          </Section>

          {/* Title */}
          <Heading style={{
            fontSize: "20px",
            color: "#111827",
            marginTop: "16px"
          }}>
            {isResolved ? `${siteName} is back up` : `${siteName} is down`}
          </Heading>

          {/* URL */}
          <Text style={{ color: "#6b7280", fontSize: "14px" }}>
            <Link href={siteUrl} style={{ color: "#6b7280" }}>
              {siteUrl}
            </Link>
          </Text>

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          {/* Details */}
          <Section>
            {!isResolved && (
              <Row
                label="Affected regions"
                value={downRegions.join(", ")}
              />
            )}

            <Row
              label={isResolved ? "Recovered at" : "Detected at"}
              value={startedAt.toLocaleString()}
            />

            <Row
              label="Type"
              value={incidentType}
            />
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          {/* Dashboard button */}
          <Link
            href={dashboardUrl}
            style={{
              backgroundColor: "#111827",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "6px",
              fontSize: "14px",
              textDecoration: "none"
            }}
          >
            View Dashboard →
          </Link>

          <Text style={{
            color: "#9ca3af",
            fontSize: "12px",
            marginTop: "32px"
          }}>
            You are receiving this because you monitor {siteName}.
          </Text>

        </Container>
      </Body>
    </Html>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Section style={{ marginBottom: "8px" }}>
      <Text style={{
        margin: 0,
        fontSize: "12px",
        color: "#9ca3af"
      }}>
        {label}
      </Text>
      <Text style={{
        margin: 0,
        fontSize: "14px",
        color: "#111827",
        fontWeight: "500"
      }}>
        {value}
      </Text>
    </Section>
  )
}