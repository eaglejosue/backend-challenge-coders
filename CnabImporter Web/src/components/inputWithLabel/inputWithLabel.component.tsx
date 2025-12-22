import { CSSProperties, useState } from 'react';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';

import styles from './inputWithLabel.module.scss';
import useScreenSize from '../../hooks/useScreenSize';
import SearchSvg from '../../assets/svg/search.svg';

export interface InputWithLabelProps {
  type: string;
  placeholder: string;
  label?: string;
  btnSearch?: boolean;
  btnDisabled?: boolean;
  onSearch: (value: string) => void;
  isLoading?: boolean;
}

const InputWithLabel = (p: InputWithLabelProps) => {
  const { isExtraSmallScreen, isSmallScreen, isMediumScreen, isLargeScreen, isExtraLargeScreen } = useScreenSize();

  const buttonStyle: CSSProperties = {
    position: 'absolute',
    top: isExtraLargeScreen ? '32%' : isLargeScreen ? '32%' : isMediumScreen ? '30%' : isSmallScreen ? '28%' : isExtraSmallScreen ? '32%' : '30%',
    left: isLargeScreen ? '50%' : isExtraLargeScreen ? '52%' : '',
    right: isLargeScreen || isExtraLargeScreen ? '' : '1%',
    height: isLargeScreen || isExtraLargeScreen ? '' : '60%',
  };

  const [searchTerm, setSearchTerm] = useState('');

  const {
    handleSubmit
  } = useForm();

  const onSubmit = () => {
    p.onSearch(searchTerm);
    // Removendo a linha que limpa o campo de busca
    // setSearchTerm('');
  };

  return (
    <div className={classnames(styles.labelFloat)}>
      <form onSubmit={handleSubmit(onSubmit)}>

        <input
          type={p.type}
          placeholder={p.placeholder}
          className={isLargeScreen || isExtraLargeScreen ? '' : 'w-100'}
          onChange={e => setSearchTerm(e.target.value)}
          value={searchTerm}
        />

        <label>{p.label}</label>

        {p.btnSearch && (
          <button id='btn-search' className='btn bg-white d-flex align-items-center'
            type='submit'
            style={buttonStyle}
            disabled={p.btnDisabled}
          >
            {p.isLoading ? (
              <div className='d-flex justify-content-center align-items-center' style={{ height: '100%', borderRadius: '9px' }}>
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status" />
              </div>
            ) : (
              <img src={SearchSvg} />
            )}
          </button>
        )}

      </form>
    </div>
  );
}

export default InputWithLabel;
