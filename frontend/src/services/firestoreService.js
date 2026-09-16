import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../config/firebase";

export function subscribeToCollection(
  collectionName,
  callback,
  options = {}
) {
  const collectionRef = collection(db, collectionName);

  const firestoreQuery = options.orderByField
    ? query(
        collectionRef,
        orderBy(
          options.orderByField,
          options.orderDirection || "desc"
        )
      )
    : collectionRef;

  return onSnapshot(
    firestoreQuery,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      callback(data);
    },
    (error) => {
      console.error(
        `Firestore listener error [${collectionName}]:`,
        error
      );
    }
  );
}

export function subscribeToTransactionItems(
  transactionId,
  callback
) {
  const itemsRef = collection(
    db,
    "transactions",
    transactionId,
    "items"
  );

  return onSnapshot(
    itemsRef,
    (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      callback(items);
    },
    (error) => {
      console.error(
        `Firestore listener error [transactions/${transactionId}/items]:`,
        error
      );
    }
  );
}

// ============================================================
// EVENTS REALTIME
// ============================================================

export function subscribeToEvents(
  callback,
  limit = 50
) {
  return subscribeToCollection(
    "events",
    callback,
    {
      orderByField: "timestamp",
      orderDirection: "desc",
      limit,
    }
  );
}