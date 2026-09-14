import './Button.css';

/**
 * Componente reutilizável de Botão
 * @param {Object} props
 * @param {React.ReactNode} props.children - Conteúdo interno do botão
 * @param {'primary' | 'secondary' | 'outline'} [props.variant='primary'] - Estilo do botão
 * @param {'small' | 'medium' | 'large'} [props.size='medium'] - Tamanho do botão
 * @param {boolean} [props.disabled=false] - Estado desabilitado
 * @param {function} [props.onClick] - Manipulador de clique
 * @param {string} [props.type='button'] - Atributo HTML type
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  ...restProps
}) {
  const classNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    disabled ? 'btn-disabled' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </button>
  );
}
