import { useState } from "react";
import { Card } from "react-bootstrap";

import "./paymentForm.component.scss";
import useScreenSize from "../../hooks/useScreenSize";

export interface PaymentFormProps {
  onTermsAcceptanceChange: (accepted: boolean) => void;
  onConfirmPayment: () => void;
  termsAndConditions?: string;
  acceptedTerms: boolean;
  isLoading: boolean;
  viewPaymentButton: boolean;
}

const PaymentForm = (p: PaymentFormProps) => {
  const { isLargeScreen, isExtraLargeScreen } = useScreenSize();
  const Container = isExtraLargeScreen || isLargeScreen ? Card : "div";
  const [errorMessage, setErrorMessage] = useState("");

  const handlePaymentConfirmation = () => {
    if (!p.acceptedTerms) {
      setErrorMessage(
        "Antes de prosseguir, por favor, confirme que leu e concorda com nossos termos e condições.",
      );
    } else {
      setErrorMessage("");
      p.onConfirmPayment();
    }
  };

  return (
    <div className="payment-form-container">
      <Container className="mt-4">
        <Card.Body>
          <div className="terms-and-conditions">
            <div
              className="bg-body-bg p-4 rounded terms-and-conditions"
              style={{ maxHeight: "390px", overflowY: "auto" }}
            >
              {/* <p className='fw-bold f-19'>Termos e Condições</p> */}
              {p.termsAndConditions?.length && (
                <p
                  className="terms-text f-14"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {p.termsAndConditions}
                </p>
              )}
              {p.isLoading && (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "100%", borderRadius: "9px" }}
                >
                  <div
                    className="spinner-border text-primary"
                    style={{ width: "3rem", height: "3rem" }}
                    role="status"
                  />
                </div>
              )}
            </div>
            <label className="f-14 m-4">
              <input
                type="checkbox"
                className="mr-1"
                checked={p.acceptedTerms}
                onChange={(e) => {
                  p.onTermsAcceptanceChange(e.target.checked);
                  setErrorMessage("");
                }}
              />
              Li e concordo com os{" "}
              <span className="fw-bold">Termos e Condições</span> da plataforma
            </label>
          </div>

          <div className="d-flex justify-content-center align-items-center">
            {errorMessage && (
              <span className="text-danger f-14">{errorMessage}</span>
            )}
          </div>

          {p.viewPaymentButton && (
            <div className="d-flex w-100 justify-content-center align-items-center mt-3">
              <button
                className="btn btn-primary text-white rounded-5 f-14 px-4 p-2"
                onClick={handlePaymentConfirmation}
              >
                Efetuar Pagamento
                {p.isLoading && (
                  <span
                    className="spinner-border spinner-border-sm text-light ms-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
              </button>
            </div>
          )}

          <div className="mt-3 px-4">
            <p className="text-center text-icon f-14 mb-0">
              *Para visualizar o livro você precisa fazer login na plataforma.
            </p>
          </div>
        </Card.Body>
      </Container>
    </div>
  );
};

export default PaymentForm;
