export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-80 bg-background">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-primary border-solid" />
    </div>
  );
}
