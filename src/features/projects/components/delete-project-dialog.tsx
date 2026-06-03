"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2, AlertTriangle } from "lucide-react";

interface DeleteProjectDialogProps {
  isOpen: boolean;
  projectName: string;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}

export function DeleteProjectDialog({
  isOpen,
  projectName,
  onConfirm,
  onClose,
  loading,
}: DeleteProjectDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h2 className="text-xl font-semibold text-foreground">
              Delete Project
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer rounded-full p-1.5 hover:bg-accent transition-colors"
            type="button"
            disabled={loading}
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{projectName}</span>
            ? All the assignments will be deleted as well
          </p>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="rounded-2xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              variant="destructive"
              className="rounded-2xl cursor-pointer flex items-center gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Project"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
