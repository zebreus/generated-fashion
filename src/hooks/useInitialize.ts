import { getAnalytics, setAnalyticsCollectionEnabled } from "firebase/analytics"
import { FirebaseApp, FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app"
import { connectFirestoreEmulator, getFirestore, initializeFirestore } from "firebase/firestore"
import { connectFunctionsEmulator, getFunctions } from "firebase/functions"
import { connectStorageEmulator, getStorage } from "firebase/storage"
import { useEffect } from "react"

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env["NEXT_PUBLIC_FIREBASE_API_KEY"],
  authDomain: process.env["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"],
  projectId: process.env["NEXT_PUBLIC_FIREBASE_PROJECT_ID"],
  storageBucket: process.env["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"],
  messagingSenderId: process.env["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"],
  appId: process.env["NEXT_PUBLIC_FIREBASE_APP_ID"],
  measurementId: process.env["NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"],
}

export function initialize() {
  if (!getApps().length) {
    try {
      initializeApp(firebaseConfig)

      const firestoreSettings = { ignoreUndefinedProperties: true, experimentalForceLongPolling: true }
      initializeFirestore(getApps()[0] as FirebaseApp, firestoreSettings)
    } catch (error) {
      console.error(error)
    }
    if (process.env["NEXT_PUBLIC_USE_FIREBASE_EMULATOR"] === "true") {
      connectFirestoreEmulator(getFirestore(), "127.0.0.1", 8080)
      connectFunctionsEmulator(getFunctions(), "127.0.0.1", 5001)
      connectFunctionsEmulator(getFunctions(getApp(), "europe-west3"), "127.0.0.1", 5001)
      connectStorageEmulator(getStorage(), "localhost", 9199)
    }
  }
}
initialize()

export function useInitialize() {
  useEffect(() => {
    // @ts-expect-error: This is probably correct
    window["ga-disable-" + process.env["NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"]] = true
    setAnalyticsCollectionEnabled(getAnalytics(), false)
  }, [])
}
