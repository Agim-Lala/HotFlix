import React, { useState, useEffect, useRef } from "react";
import { Input, Select, Button, message } from "antd";
import { User, updateUserProfile } from "../../../api/userApi";
import styles from "./UserProfileForm.module.css";

interface UserProfileFormProps {
  user: User;
  userId: number;
  onSave: (updatedUser: User) => void;
}
const UserProfileForm: React.FC<UserProfileFormProps> = ({
  user,
  userId,
  onSave,
}) => {
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (user && formRef.current) {
      const form = formRef.current;
      (form.elements.namedItem("username") as HTMLInputElement).value =
        user.username || "";
      (form.elements.namedItem("email") as HTMLInputElement).value =
        user.email || "";
      (form.elements.namedItem("firstName") as HTMLInputElement).value =
        user.firstName || "";
      (form.elements.namedItem("lastName") as HTMLInputElement).value =
        user.lastName || "";
      (form.elements.namedItem("role") as HTMLSelectElement).value =
        user.role || "user";
      (
        form.elements.namedItem("subscriptionPlanId") as HTMLSelectElement
      ).value = String(user.subscriptionPlanId || 1);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    const form = new FormData(formRef.current);
    const data = {
      username: form.get("username") as string,
      email: form.get("email") as string,
      firstName: form.get("firstName") as string,
      lastName: form.get("lastName") as string,
      role: form.get("role") as string,
      subscriptionPlanId: Number(form.get("subscriptionPlanId")),
    };

    setLoading(true);
    setSuccess("");
    try {
      await updateUserProfile(userId, data);
      setSuccess("Profile updated!");
      onSave({ ...user, ...data });
    } catch {
      message.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form ref={formRef} onSubmit={handleSubmit} className={styles.profileForm}>
      <div className={styles.row}>
        <div>
          <p>Username</p>
          <Input placeholder="Username" name="username" />
        </div>
        <div>
          <p>Email</p>
          <Input placeholder="Email" name="email" />
        </div>
      </div>

      <div className={styles.row}>
        <div>
          <p>First Name</p>
          <Input placeholder="First Name" name="firstName" />
        </div>
        <div>
          <p>Last Name</p>
          <Input placeholder="Last Name" name="lastName" />
        </div>
      </div>

      <div className={styles.row}>
        <div>
          <p>Subscription</p>
          <Select
            className={styles.tallSelect}
            defaultValue={user.subscriptionPlanId || 1}
            onChange={(value) => {
              const hidden = document.getElementById(
                "subscriptionPlanId"
              ) as HTMLInputElement;
              if (hidden) hidden.value = value.toString();
            }}
          >
            <Select.Option value={1}>Free</Select.Option>
            <Select.Option value={2}>Basic</Select.Option>
            <Select.Option value={3}>Premium</Select.Option>
          </Select>
          <input
            type="hidden"
            name="subscriptionPlanId"
            id="subscriptionPlanId"
            defaultValue={String(user.subscriptionPlanId || 1)}
          />
        </div>

        <div>
          <p>Role</p>
          <Select
            className={styles.tallSelect}
            defaultValue={user.role || "user"}
            onChange={(value) => {
              const hidden = document.getElementById(
                "role"
              ) as HTMLInputElement;
              if (hidden) hidden.value = value.toString();
            }}
          >
            <Select.Option value="customer">Customer</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
          <input
            type="hidden"
            name="role"
            id="role"
            defaultValue={String(user.role || "user")}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          htmlType="submit"
          loading={loading}
          className={`${styles.fullWidth} ${styles.saveButton}`}
        >
          Save
        </Button>
        {success && <span className={styles.successMessage}>{success}</span>}
      </div>
    </form>
  );
};

export default UserProfileForm;
