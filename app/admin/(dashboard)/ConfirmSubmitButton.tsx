"use client";

/**
 * Botão de submit com confirmação.
 *
 * Precisa ser Client Component: `onClick` é uma função, e uma função não pode
 * ser serializada no stream do RSC. Colocar o handler direto no `<button>` de
 * uma page (Server Component) quebra o render inteiro.
 */
interface ConfirmSubmitButtonProps {
  message: string;
  className?: string;
  children: React.ReactNode;
}

export function ConfirmSubmitButton({
  message,
  className,
  children,
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
