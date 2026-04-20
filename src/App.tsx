import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { NavBar } from "./components/NavBar";
import { ProgressBar } from "./components/ProgressBar";
import { LandingPage } from "./pages/LandingPage";
import { ProfileStep } from "./steps/ProfileStep";
import { UncommonSituationsStep } from "./steps/UncommonSituationsStep";
import { LossReactionStep } from "./steps/LossReactionStep";
import { InvestmentGoalStep } from "./steps/InvestmentGoalStep";
import { PortfolioSelectStep } from "./steps/PortfolioSelectStep";
import { PortfolioDashboardStep } from "./steps/PortfolioDashboardStep";
import { EmailNameStep } from "./steps/account/EmailNameStep";
import { PhoneStep } from "./steps/account/PhoneStep";
import { AddressStep } from "./steps/account/AddressStep";
import { IdentityStep } from "./steps/account/IdentityStep";
import { SecurityStep } from "./steps/account/SecurityStep";
import { AccountTypeStep } from "./steps/account/AccountTypeStep";
import { TaxEmploymentStep } from "./steps/account/TaxEmploymentStep";
import { FinancialsStep } from "./steps/account/FinancialsStep";
import { InvestingExperienceStep } from "./steps/account/InvestingExperienceStep";
import { DEFAULTS, ACCOUNT_DEFAULTS } from "./lib/types";
import type { FormData, AccountData } from "./lib/types";

const ACCOUNT_TOTAL_STEPS = 10;
const TOTAL_STEPS = 5;

export default function App() {
  const [view, setView] = useState<"landing" | "account" | "onboarding">(
    "landing",
  );
  const [accountStep, setAccountStep] = useState(1);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({ ...DEFAULTS });
  const [accountData, setAccountData] = useState<AccountData>({
    ...ACCOUNT_DEFAULTS,
  });

  const updateField = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const updateAccountField = useCallback(
    <K extends keyof AccountData>(key: K, value: AccountData[K]) => {
      setAccountData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleGetStarted = useCallback(() => {
    setView("account");
    setAccountStep(1);
  }, []);

  const accountNext = useCallback(() => {
    if (accountStep === ACCOUNT_TOTAL_STEPS) {
      setView("onboarding");
      setStep(1);
    } else {
      setAccountStep((s) => s + 1);
    }
  }, [accountStep]);

  const accountBack = useCallback(() => {
    if (accountStep === 1) {
      setView("landing");
    } else {
      setAccountStep((s) => s - 1);
    }
  }, [accountStep]);

  const next = useCallback(
    () => setStep((s) => Math.min(s + 1, TOTAL_STEPS)),
    [],
  );

  const back = useCallback(() => {
    if (step === 1) {
      setView("account");
      setAccountStep(ACCOUNT_TOTAL_STEPS);
    } else {
      setStep((s) => s - 1);
    }
  }, [step]);

  const stepKey = `step-${step}`;

  const renderAccountStep = () => {
    switch (accountStep) {
      case 1:
        return (
          <EmailNameStep
            data={accountData}
            onChange={updateAccountField}
            onNext={accountNext}
            onBack={accountBack}
          />
        );
      case 2:
        return (
          <PhoneStep
            data={accountData}
            onChange={updateAccountField}
            onNext={accountNext}
            onBack={accountBack}
          />
        );
      case 3:
        return (
          <AddressStep
            data={accountData}
            onChange={updateAccountField}
            onNext={accountNext}
            onBack={accountBack}
          />
        );
      case 4:
        return (
          <IdentityStep
            data={accountData}
            onChange={updateAccountField}
            onNext={accountNext}
            onBack={accountBack}
          />
        );
      case 5:
        return (
          <SecurityStep
            data={accountData}
            onChange={updateAccountField}
            onNext={accountNext}
            onBack={accountBack}
          />
        );
      case 6:
        return (
          <AccountTypeStep
            data={accountData}
            onChange={updateAccountField}
            onNext={accountNext}
            onBack={accountBack}
          />
        );
      case 7:
        return (
          <TaxEmploymentStep
            data={accountData}
            onChange={updateAccountField}
            onNext={accountNext}
            onBack={accountBack}
          />
        );
      case 8:
        return (
          <FinancialsStep
            data={accountData}
            onChange={updateAccountField}
            onNext={accountNext}
            onBack={accountBack}
          />
        );
      case 9:
        return (
          <UncommonSituationsStep
            data={accountData}
            onChange={updateAccountField}
            onNext={accountNext}
            onBack={accountBack}
          />
        );
      case 10:
        return (
          <InvestingExperienceStep
            data={accountData}
            onChange={updateAccountField}
            onNext={accountNext}
            onBack={accountBack}
          />
        );
      default:
        return null;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ProfileStep
            data={formData}
            onChange={updateField}
            onNext={next}
            onBack={back}
          />
        );
      case 2:
        return (
          <LossReactionStep
            data={formData}
            onChange={updateField}
            onNext={next}
            onBack={back}
          />
        );
      case 3:
        return (
          <InvestmentGoalStep
            data={formData}
            onChange={updateField}
            onNext={next}
            onBack={back}
          />
        );
      case 4:
        return (
          <PortfolioSelectStep
            data={formData}
            onChange={updateField}
            onNext={next}
            onBack={back}
          />
        );
      case 5:
        return (
          <PortfolioDashboardStep
            formData={formData}
            accountData={accountData}
            onChange={updateField}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden transition-colors duration-700">
      <NavBar />
      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <LandingPage key="landing" onGetStarted={handleGetStarted} />
        ) : view === "account" ? (
          <div key="account-wizard" className="flex-1 flex flex-col">
            <ProgressBar
              current={accountStep}
              total={ACCOUNT_TOTAL_STEPS}
            />
            <p className="text-center text-sm text-muted pt-3">
              Step {accountStep} of {ACCOUNT_TOTAL_STEPS}
            </p>
            <AnimatePresence
              mode="wait"
              key={`account-${accountStep}`}
            >
              {renderAccountStep()}
            </AnimatePresence>
          </div>
        ) : (
          <div key="wizard" className="flex-1 flex flex-col">
            {step <= 3 && (
              <ProgressBar current={step} total={3} />
            )}
            <AnimatePresence mode="wait" key={stepKey}>
              {renderStep()}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
