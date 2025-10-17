export default function ErrorMessage({ message }) {
  return message ? (
    <p className="text-red-500 text-sm mt-1 sm:mt-2 break-words">
      {message}
    </p>
  ) : null;
}
