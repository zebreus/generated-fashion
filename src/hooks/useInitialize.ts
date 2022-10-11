import { getAnalytics, setAnalyticsCollectionEnabled } from "firebase/analytics"
import { FirebaseApp, FirebaseOptions, getApps, initializeApp } from "firebase/app"
import { initializeFirestore } from "firebase/firestore"
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
    //   if (secrets.emulator?.host && process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR === "true") {
    //     if (secrets.emulator.firestorePort) {
    //       connectFirestoreEmulator(getFirestore(), secrets.emulator.host, secrets.emulator.firestorePort)
    //     }
    //     if (secrets.emulator.authPort) {
    //       connectAuthEmulator(getAuth(), "http://" + secrets.emulator.host + ":" + secrets.emulator.authPort)
    //     }
    //     if (secrets.emulator.functionsPort) {
    //       connectFunctionsEmulator(getFunctions(), secrets.emulator.host, secrets.emulator.functionsPort)
    //       connectFunctionsEmulator(
    //         getFunctions(getApps()[0], "europe-west1"),
    //         secrets.emulator.host,
    //         secrets.emulator.functionsPort
    //       )
    //     }
    //     if (secrets.emulator.storagePort) {
    //       connectStorageEmulator(getStorage(), secrets.emulator.host, secrets.emulator.storagePort)
    //     }
    //   }
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
