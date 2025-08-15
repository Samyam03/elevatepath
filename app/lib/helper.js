
export function entriesToMarkdown(entries, type) {
  if (!entries?.length) return "";

  return (
    `## ${type}\n\n` +
    entries
      .map((entry) => {
        const dateRange = entry.current
          ? `${entry.startDate} - Present`
          : `${entry.startDate} - ${entry.endDate}`;
        
        if (type === "Work Experience") {
          return `### ${entry.title} @ ${entry.organization}\n${dateRange}\n\n${entry.description}`;
        } else if (type === "Education") {
          const gpaInfo = entry.gpa ? ` • GPA: ${entry.gpa}` : '';
          return `### ${entry.degree} in ${entry.field}\n${entry.institution} • ${dateRange}${gpaInfo}\n\n${entry.description || ''}`;
        } else if (type === "Projects") {
          const linkInfo = entry.link ? `\n[View Project](${entry.link})` : '';
          return `### ${entry.title}\n${entry.technologies} • ${dateRange}${linkInfo}\n\n${entry.description}`;
        }
        
        // Fallback for unknown types
        return `### ${entry.title} @ ${entry.organization}\n${dateRange}\n\n${entry.description}`;
      })
      .join("\n\n")
  );
}