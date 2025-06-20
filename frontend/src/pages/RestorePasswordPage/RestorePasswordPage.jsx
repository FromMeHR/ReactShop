import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { PASSWORD_PATTERN } from "../../constants/constants";
import { RestorePasswordResultModal } from "./RestorePasswordResult/RestorePasswordResultModal";
import axios from "axios";
import classnames from "classnames";
import css from "./RestorePasswordPage.module.css";

export function RestorePasswordPage() {
  const { uid, token } = useParams();
  const [restorePasswordStatus, setRestorePasswordStatus] = useState("");
  const [showRestorePasswordResultModal, setShowRestorePasswordResultModal] = useState(false);

  const errorMessageTemplates = {
    required: "Field is required",
    password: "Password must be 8+ characters, contain at least one uppercase letter, lowercase letter and digit",
    confirmPassword: "Passwords do not match",
    maxLength: "Field must be 128 characters or less",
  };

  const {
    register,
    handleSubmit,
    watch,
    setError,
    trigger,
    formState: { errors, isValid },
  } = useForm({ mode: "all", criteriaMode: "all" });

  const watchedPassword = watch("password");
  const watchedConfirmPassword = watch("confirmPassword");
  const disabled = !isValid;

  useEffect(() => {
    const handleValidation = async () => {
      await trigger(["password", "confirmPassword"]);
    };

    if (watchedPassword && watchedConfirmPassword) {
      handleValidation();
    }
  }, [watchedPassword, watchedConfirmPassword, trigger]);

  const onSubmit = async (value) => {
    const dataToSend = {
      uid: uid,
      token: token,
      new_password: value.password,
      re_new_password: value.confirmPassword,
    };

    await axios({
      method: "post",
      url: `${process.env.REACT_APP_BASE_API_URL}/api/auth/users/reset_password_confirm/`,
      data: dataToSend,
    })
      .then((resp) => {
        setRestorePasswordStatus(resp.data.message);
        setShowRestorePasswordResultModal(true);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.new_password
        ) {
          const newPasswordError = error.response.data.new_password[0];
          if (newPasswordError === "This password is too common.") {
            setError("confirmPassword", {
              type: "manual",
              message: "The password is too common.",
            });
          } else if (
            newPasswordError.startsWith("The password is too similar to the")
          ) {
            setError("confirmPassword", {
              type: "manual",
              message:
                "The password is too similar to the personal account information.",
            });
          }
        } else {
          setRestorePasswordStatus("Restore password error");
          setShowRestorePasswordResultModal(true);
        }
      });
  };

  return (
    <>
      <div className={css["container"]}>
        <div className={css["container__body"]}>
          <p className={css["title"]}>Restore password</p>
          <div className={css["content"]}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className={css["forms__item"]}>
                <div
                  className={classnames(css["form-floating"], {
                    [css["has-error"]]: errors.password,
                  })}
                >
                  <input
                    id="form-password"
                    type="password"
                    {...register("password", {
                      required: errorMessageTemplates.required,
                      pattern: {
                        value: PASSWORD_PATTERN,
                        message: errorMessageTemplates.password,
                      },
                      maxLength: {
                        value: 128,
                        message: errorMessageTemplates.maxLength,
                      },
                    })}
                  />
                  <label htmlFor="form-password">New password</label>
                  <div className={css["error-message"]}>
                    <ErrorMessage
                      errors={errors}
                      name={"password"}
                      render={({ messages }) =>
                        messages &&
                        Object.entries(messages).map(([type, message]) => (
                          <p key={type}>{message}</p>
                        ))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className={css["forms__item"]}>
                <div
                  className={classnames(css["form-floating"], {
                    [css["has-error"]]: errors.confirmPassword,
                  })}
                >
                  <input
                    id="form-password_confirm"
                    type="password"
                    {...register("confirmPassword", {
                      required: errorMessageTemplates.required,
                      maxLength: {
                        value: 128,
                        message: errorMessageTemplates.maxLength,
                      },
                      validate: (value) =>
                        watch("password") !== value
                          ? errorMessageTemplates.confirmPassword
                          : null,
                    })}
                  />
                  <label htmlFor="form-password_confirm">Repeat new password</label>
                  <div className={css["error-message"]}>
                    <ErrorMessage
                      errors={errors}
                      name={"confirmPassword"}
                      render={({ messages }) =>
                        messages &&
                        Object.entries(messages).map(([type, message]) => (
                          <p key={type}>{message}</p>
                        ))
                      }
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={disabled}
                className={css["save-password-form__btn"]}
              >
                Save password
              </button>
            </form>
          </div>
        </div>
      </div>
      <RestorePasswordResultModal
        show={showRestorePasswordResultModal}
        restorePasswordStatus={restorePasswordStatus}
        handleClose={() => setShowRestorePasswordResultModal(false)}
      />
    </>
  );
}
