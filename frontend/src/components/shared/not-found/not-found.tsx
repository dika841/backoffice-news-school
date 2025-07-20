export const NotFound = () => {
  return (
    <section className="w-full min-h-dvh flex flex-col items-center justify-center">
      <img
        src="/404.webp"
        alt="404 Not Found"
        loading="lazy"
        className="w-1/4"
      />
      <h1 className="text-4xl font-bold text-primary">Oops ! 404 Not Found</h1>
    </section>
  )
}
