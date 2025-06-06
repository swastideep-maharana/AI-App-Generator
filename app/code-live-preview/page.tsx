// app/code-live-preview/page.tsx

import CodeLivePreview from "@/components/CodeLivePreview";

const exampleCode = `
import React from "react";

export default function App() {
  return <h1>Hello from AI code!</h1>;
}
`;

export default function Page() {
  return (
    <div style={{ padding: 20 }}>
      <CodeLivePreview result={exampleCode} />
    </div>
  );
}
