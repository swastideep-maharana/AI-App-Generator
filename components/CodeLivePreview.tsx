"use client";

import React, { useState } from "react";
import { LiveProvider, LiveError, LivePreview } from "react-live";

function prepareCodeForLivePreview(code: string) {
  // Remove import statements
  const noImports = code.replace(/^import .*from .*\n?/gm, "");
  // Remove export default
  const noExports = noImports.replace(/export default /gm, "");
  // If code contains function App, add render
  if (/function\s+App\s*\(/.test(noExports)) {
    return noExports + "\n\nrender(<App />);";
  }
  return noExports;
}

export default function CodeLivePreview({ result }: { result: string }) {
  const [code, setCode] = useState(() => prepareCodeForLivePreview(result));

  React.useEffect(() => {
    setCode(prepareCodeForLivePreview(result));
  }, [result]);

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
      <LiveProvider code={code} language="jsx" noInline>
        <LivePreview
          style={{
            padding: 12,
            border: "1px solid #ccc",
            borderRadius: 4,
            marginBottom: 8,
          }}
        />
        <LiveError
          style={{
            color: "red",
            fontWeight: "bold",
            whiteSpace: "pre-wrap",
          }}
        />
      </LiveProvider>
    </div>
  );
}
