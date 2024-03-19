import React, { ReactElement } from 'react';

export default async function SetupPage(): Promise<ReactElement> {
  return (
    <div className="mt-16 flex-col flex-wrap text-center ">
      <div className="text-mono-50 text-lg">Missing or Invalid Environment Variables</div>
      <div className="text-mono-50 mt-3">
        <p>It seems that some necessary environment variables are not set for this website to function properly.</p>
        <p>Please check your configuration and ensure all required environment variables are included.</p>
      </div>
    </div>
  );
}
