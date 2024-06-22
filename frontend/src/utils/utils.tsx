export type FirestoreTimestamp = {
  _seconds: number;
  _nanoseconds: number;
};

const formatDate = (timestamp: FirestoreTimestamp) => {
  const date = new Date(
    timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
  );
  return date.toLocaleString(); // Or any other format you prefer
};

export { formatDate };
