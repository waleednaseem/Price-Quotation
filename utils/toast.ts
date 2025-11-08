import { toast, ToastOptions } from "react-toastify";

const defaultOpts: ToastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

export const notifySuccess = (message: string, opts?: ToastOptions) =>
  toast.success(message, { ...defaultOpts, ...opts });

export const notifyInfo = (message: string, opts?: ToastOptions) =>
  toast.info(message, { ...defaultOpts, ...opts });

export const notifyError = (message: string, opts?: ToastOptions) =>
  toast.error(message, { ...defaultOpts, ...opts });

export const comingSoon = (label: string) =>
  toast("" + label + " coming soon", defaultOpts);