'use client';
import { useSignIn } from "@clerk/nextjs/legacy";
import React from 'react';

export default function TestPage() {
  const { signIn } = useSignIn();
  
  if (!signIn) return <div>No signIn</div>;

  return <div>{JSON.stringify(Object.keys(signIn))}</div>;
}
