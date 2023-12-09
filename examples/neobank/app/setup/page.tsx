import React, { ReactElement } from 'react';

export default async function SetupPage(): Promise<ReactElement> {
  return (
    <div className="mt-16 flex-col flex-wrap text-center ">
      <div className="text-lg text-mono-50">Missing or Invalid Environment Variables</div>
      <div className="mt-3 text-mono-50">
        <p>It seems that some necessary environment variables are not set for this website to function properly.</p>
        <p>Please check your configuration and ensure all required environment variables are included.</p>
      </div>
    </div>
  );
}
