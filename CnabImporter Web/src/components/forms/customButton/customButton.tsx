import React from 'react';

export interface ButtonProps {
  onClick: () => void;
  disabled: boolean;
  type?: 'submit' | 'reset' | 'button' | undefined;
  text?: 'Filtrar' | 'Novo' | string;
  materialText?: 'filter_list' | 'add' | string;
}

const CustomButton: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  type = 'button',
  text = 'Filtrar',
  materialText = 'filter_list'
}) => {
  return (
    <button
      className='btn d-flex align-items-center rounded text-primary border-primary'
      type={type}
      onClick={onClick}
      style={{ minHeight: '52px' }}
      disabled={disabled}
    >
      <span
        className='material-symbols-outlined'
        style={{ paddingRight: '0.5rem' }}
      >
        {materialText}
      </span>
      {text}
    </button>
  );
};

export default CustomButton;
