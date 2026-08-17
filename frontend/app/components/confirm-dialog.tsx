"use client";

import { useEffect, useRef, useState } from "react";

export type ConfirmRequest = {
  title: string;
  body?: string;
  confirmLabel: string;
  danger?: boolean;
  /**
   * When set, the operator has to retype this exact string before confirming. Used for permanent
   * deletion, where the backend also demands the title back in a header.
   */
  requireText?: string;
  requireTextLabel?: string;
};

/**
 * Confirmation for actions that cannot be undone from the interface. Replaces `window.confirm` and
 * `window.prompt`, which cannot be styled, ignore the theme, and put an operating-system dialog in
 * front of a product surface.
 */
export function ConfirmDialog({
  request,
  onConfirm,
  onCancel,
}: {
  request: ConfirmRequest;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [typed, setTyped] = useState("");
  const satisfied = !request.requireText || typed === request.requireText;

  useEffect(() => {
    const element = dialog.current;
    if (!element?.open) element?.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="confirm-dialog-title"
      // Fires on Escape and on the backdrop close gesture.
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <div className="dialog-content">
        <h2 id="confirm-dialog-title" className="dialog-title">
          {request.title}
        </h2>
        {request.body && <p className="dialog-body">{request.body}</p>}
        {request.requireText && (
          <div className="field">
            <label htmlFor="confirm-dialog-input">
              {request.requireTextLabel ?? "Type the name to confirm"}
            </label>
            <input
              id="confirm-dialog-input"
              className="input"
              value={typed}
              autoFocus
              autoComplete="off"
              onChange={(event) => setTyped(event.target.value)}
            />
          </div>
        )}
        <div className="dialog-actions">
          <button
            type="button"
            className="button button-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`button ${request.danger ? "button-danger" : "button-primary"}`}
            disabled={!satisfied}
            onClick={onConfirm}
          >
            {request.confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
