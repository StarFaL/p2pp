export default function ErrorMessage({ message }) {
  return message ? <p className="text-error text-sm mt-2">{message}</p> : null;
}