"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { createProject, updateProject } from "../actions";
import { Project } from "../types";
import { X, Loader2, Upload } from "lucide-react";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project?: Project | null;
}

export function CreateProjectDialog({
  isOpen,
  onClose,
  onSuccess,
  project = null,
}: CreateProjectDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with selected project when editing
  useEffect(() => {
    if (isOpen) {
      if (project) {
        setName(project.name);
        setDescription(project.description || "");
        setImagePreview(project.image);
        setImageFile(null);
      } else {
        setName("");
        setDescription("");
        setImagePreview(null);
        setImageFile(null);
      }
      setFormError("");
    }
  }, [project, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Image file size must be less than 5MB.");
        return;
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setFormError("");
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview && !imagePreview.startsWith("http")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setImageFile(null);
    if (imagePreview && !imagePreview.startsWith("http")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFormError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Project name is required.");
      return;
    }
    setFormError("");
    setFormLoading(true);

    try {
      let res;
      if (project) {
        res = await updateProject(project.id, {
          name: name.trim(),
          description: description.trim(),
          image: imageFile,
        });
      } else {
        res = await createProject({
          name: name.trim(),
          description: description.trim(),
          image: imageFile,
        });
      }

      if (res.success) {
        handleClose();
        onSuccess();
      } else {
        setFormError(res.message || "Failed to submit project.");
      }
    } catch (err: any) {
      setFormError(err.message || "An error occurred while submitting the project.");
    } finally {
      setFormLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {project ? "Edit Project" : "Create New Project"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {project ? "Modify project name, description, or cover image" : "Define your project details and set a banner image"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer rounded-full p-1.5 hover:bg-accent transition-colors"
            type="button"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <FieldGroup className="gap-5">
            {formError && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-2xl border border-destructive/20 font-medium">
                {formError}
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="modal-project-name">
                Project Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="modal-project-name"
                placeholder="e.g. Design System Implementation"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={formLoading}
                className="h-10 bg-input/40 border-border/80 rounded-2xl"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="modal-project-desc">Description</FieldLabel>
              <textarea
                id="modal-project-desc"
                placeholder="A brief overview detailing the objectives and scope of this project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={formLoading}
                rows={4}
                className="w-full rounded-2xl border border-border bg-input/40 px-3 py-2.5 text-sm transition-[color,box-shadow,background-color] outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </Field>

            <Field className="gap-2">
              <FieldLabel>Project Banner Image</FieldLabel>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
                id="modal-project-image-input"
              />

              {!imagePreview ? (
                <label
                  htmlFor="modal-project-image-input"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-border/70 hover:border-ring/50 bg-input/20 hover:bg-input/30 cursor-pointer rounded-2xl p-6 transition-all duration-200"
                >
                  <Upload className="w-8 h-8 text-muted-foreground/80 mb-2 transition-transform duration-200" />
                  <span className="text-sm font-medium text-foreground">Click to upload image</span>
                  <span className="text-xs text-muted-foreground mt-1 font-normal">PNG, JPG, or WEBP (Max 5MB)</span>
                </label>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-border bg-muted aspect-video group">
                  <img
                    src={imagePreview}
                    alt="Selected preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-3 py-1.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-transform scale-95 group-hover:scale-100 duration-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      Remove Image
                    </button>
                  </div>
                </div>
              )}
            </Field>

            {/* Footer actions */}
            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={formLoading}
                className="rounded-2xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={formLoading}
                className="rounded-2xl cursor-pointer flex items-center gap-1.5"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  project ? "Save Changes" : "Create Project"
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
