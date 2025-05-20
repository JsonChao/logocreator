import { ReactNode, useId } from "react";

export default function Spinner({
  loading = true,
  children,
  className = "",
}: {
  loading?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const spinnerID = useId();
  
  if (!loading && children) return <>{children}</>;
  
  const SpinnerElement = () => (
    <>
      <style jsx>
        {`
          @keyframes spinner {
            from {
              opacity: 1;
            }
            to {
              opacity: 0.25;
            }
          }
        `}
      </style>
      <span className={`relative inline-flex size-4 ${className}`}>
        {Array.from(Array(8).keys()).map((i) => (
          <span
            key={`${spinnerID}-dot-${i}`}
            className="absolute left-[calc(50%-12.5%/2)] top-0 h-[100%] w-[12.5%] animate-[spinner_800ms_linear_infinite] before:block before:h-[30%] before:w-[100%] before:rounded-full before:bg-current"
            style={{
              transform: `rotate(${45 * i}deg)`,
              animationDelay: `calc(-${8 - i} / 8 * 800ms)`,
            }}
          />
        ))}
      </span>
    </>
  );

  if (!children) return <SpinnerElement />;

  return (
    <span className="relative flex h-full items-center justify-center">
      <span className="opacity-0">{children}</span>

      <span className="absolute inset-0 flex items-center justify-center">
        <SpinnerElement />
      </span>
    </span>
  );
}
