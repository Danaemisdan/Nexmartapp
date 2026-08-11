import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ClerkProvider } from "@clerk/nextjs";
import { useSignIn } from "@clerk/nextjs/legacy";

function Test() {
  const { signIn } = useSignIn();
  
  if (signIn) {
    console.log("METHODS ON signIn:");
    for (const key in signIn) {
      console.log("- " + key);
    }
  } else {
    console.log("signIn is null or undefined");
  }
  return null;
}

export default function run() {
  try {
    renderToStaticMarkup(
      <ClerkProvider>
        <Test />
      </ClerkProvider>
    );
  } catch (e) {
    console.log("ERROR", e);
  }
}
run();
