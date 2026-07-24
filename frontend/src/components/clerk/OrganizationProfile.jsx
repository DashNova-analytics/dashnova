import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useOrganization,
  useOrganizationList,
  useUser,
} from "@clerk/clerk-react";

import { useToast } from "../ui/ToastContext";

import {
  Building2,
  Users,
  UserPlus,
  ShieldAlert,
} from "lucide-react";

export default function OrganizationProfile() {
  const toast = useToast();
  const navigate = useNavigate();

  const { user } = useUser();

  const {
    organization,
    membership,
    invitations,
    memberships,
  } = useOrganization({
    memberships: {
      infinite: true,
    },
    invitations: {
      infinite: true,
    },
  });

  const { userMemberships, setActive } = useOrganizationList({
    userMemberships: true,
  });

  const [activeTab, setActiveTab] = useState("general");

  const [orgName, setOrgName] = useState("");

  const [inviteEmail, setInviteEmail] = useState("");

  const [inviteRole, setInviteRole] = useState("basic_member");

  const [members, setMembers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [deleting, setDeleting] = useState(false);

  const orgNameProp = organization?.name;
  useEffect(() => {
    if (orgNameProp) {
      setOrgName((prev) => (prev === orgNameProp ? prev : orgNameProp));
    }
  }, [orgNameProp]);

  const membershipsCount = memberships?.data?.length || 0;
  useEffect(() => {
    if (!memberships?.data) return;

    const formatted = memberships.data.map((member) => ({
      id: member.id,

      email:
        member.publicUserData?.identifier ||
        "Unknown",

      name:
        member.publicUserData?.firstName &&
          member.publicUserData?.lastName
          ? `${member.publicUserData.firstName} ${member.publicUserData.lastName}`
          : member.publicUserData?.identifier,

      role: member.role,

      image: member.publicUserData?.imageUrl,
    }));

    setMembers(formatted);
  }, [membershipsCount, organization?.id]);

  if (!organization) {
    return (
      <div className="w-full border border-gray-200 rounded-lg bg-white p-12 text-center shadow-sm">
        <Building2
          size={36}
          className="text-gray-300 mx-auto mb-4"
        />

        <h4 className="text-sm font-bold text-gray-900">
          No Active Organization Found
        </h4>

        <p className="text-xs text-gray-400 mt-2">
          Create or switch to an organization first.
        </p>
      </div>
    );
  }

  const handleUpdateOrg = async (e) => {
    e.preventDefault();

    if (!orgName.trim()) {
      toast.error("Organization name cannot be empty.");
      return;
    }

    try {
      await organization.update({
        name: orgName.trim(),
      });

      toast.success(
        "Organization updated successfully."
      );
    } catch (err) {
      console.error(err);

      toast.error(
        "Unable to update organization."
      );
    }
  };
  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo image size should be less than 2MB.");
      return;
    }

    try {
      await organization.setLogo({
        file,
      });

      toast.success("Organization logo updated.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update logo.");
    }
  };

  const handleDeleteOrg = async () => {
    if (!organization) return;

    setDeleting(true);

    try {
      const currentOrgId = organization.id;

      await organization.destroy();

      const remainingOrg = userMemberships?.data?.find(
        (m) => m.organization?.id && m.organization.id !== currentOrgId
      );

      if (setActive) {
        if (remainingOrg?.organization?.id) {
          await setActive({
            organization: remainingOrg.organization.id,
          });

          toast.success(
            `Organization deleted. Switched to ${remainingOrg.organization.name}`
          );

          navigate("/dashboard", { replace: true });
          return;
        }

        await setActive({ organization: null });
      }

      toast.success("Organization deleted.");

      navigate("/create-organization", {
        replace: true,
      });

    } catch (err) {
      console.error(err);

      toast.error(
        err?.errors?.[0]?.longMessage ||
        err?.message ||
        "Unable to delete organization."
      );
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setConfirmName("");
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();

    if (!inviteEmail.trim()) {
      toast.error("Email address is required.");
      return;
    }

    try {
      await organization.inviteMember({
        emailAddress: inviteEmail.trim(),
        role: inviteRole,
      });

      setInviteEmail("");

      toast.success("Invitation sent successfully.");
    } catch (err) {
      console.error(err);

      toast.error(
        err.errors?.[0]?.longMessage ||
        "Unable to send invitation."
      );
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await organization.removeMember(memberId);

      setMembers((prev) =>
        prev.filter((m) => m.id !== memberId)
      );

      toast.success("Member removed.");
    } catch (err) {
      console.error(err);

      toast.error("Unable to remove member.");
    }
  };

  const handleRoleChange = async (
    memberId,
    newRole
  ) => {
    try {
      await organization.updateMember(memberId, {
        role: newRole,
      });

      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId
            ? { ...m, role: newRole }
            : m
        )
      );

      toast.success("Role updated.");
    } catch (err) {
      console.error(err);

      toast.error("Unable to update role.");
    }
  };

  const pendingInvitations =
    invitations?.data || [];

  const activeMembers =
    memberships?.data || [];

  const isOwner =
    !membership ||
    membership?.role === "org:admin" ||
    membership?.role === "org:owner" ||
    membership?.role === "admin" ||
    membership?.role === "owner" ||
    organization?.ownerId === user?.id;

  const currentUserEmail =
    user?.primaryEmailAddress?.emailAddress;

  const currentUserId = user?.id;

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col md:flex-row min-h-120">

      {/* Sidebar */}

      <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50 p-3.5 space-y-1 shrink-0">

        <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
          Organization
        </div>

        <button
          onClick={() => setActiveTab("general")}
          className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${activeTab === "general"
            ? "bg-white text-black border border-gray-200 shadow-xs"
            : "text-gray-500 hover:text-black hover:bg-gray-100/50"
            }`}
        >
          <Building2 size={13} />
          General settings
        </button>

        <button
          onClick={() => setActiveTab("members")}
          className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${activeTab === "members"
            ? "bg-white text-black border border-gray-200 shadow-xs"
            : "text-gray-500 hover:text-black hover:bg-gray-100/50"
            }`}
        >
          <Users size={13} />
          Members
        </button>

        <div className="pt-8 px-3">
          <div className="p-3 bg-white border border-gray-200 rounded-md text-[10px] text-gray-400 leading-normal">

            <span className="font-bold text-gray-700 block mb-0.5">
              Organization Policies
            </span>

            Workspace policies and permissions are managed directly by DashNova.

          </div>
        </div>
      </div>

      {/* Content */}

      <div className="flex-1 p-6 font-sans">

        {activeTab === "general" && (

          <div className="space-y-6">

            <div>
              <h4 className="text-sm font-bold text-gray-900">
                General Workspace Settings
              </h4>

              <p className="text-xs text-gray-400 mt-1">
                Manage your organization information.
              </p>
            </div>

            <form
              onSubmit={handleUpdateOrg}
              className="space-y-4 max-w-md border-t border-gray-100 pt-5"
            >

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">

                  {organization.imageUrl ? (

                    <img
                      src={organization.imageUrl}
                      alt={organization.name}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <Building2
                      size={22}
                      className="text-gray-400"
                    />

                  )}

                </div>

                <div>

                  <label className="text-xs font-semibold text-gray-700 cursor-pointer">

                    <span className="bg-white border border-gray-200 rounded px-2.5 py-1.5 font-bold hover:border-gray-400 transition inline-block text-[11px]">

                      Upload Organization Logo

                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />

                  </label>

                  <span className="block mt-2 text-[10px] text-gray-400">
                    JPG, PNG or GIF. Max 2 MB.
                  </span>

                </div>

              </div>

              <div>

                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Organization Name
                </label>

                <input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full h-9 px-3 border border-gray-200 rounded text-xs bg-gray-50 focus:outline-none focus:border-black"
                />

              </div>


              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Organization ID
              </label>

              <input
                readOnly
                value={organization.id}
                className="w-full h-9 px-3 border border-gray-200 rounded text-xs bg-gray-100 font-mono"
              />
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Organization Slug
                </label>

                <input
                  readOnly
                  value={organization.slug || ""}
                  className="w-full h-9 px-3 border border-gray-200 rounded text-xs bg-gray-100 font-mono"
                />
              </div>

              <button
                type="submit"
                className="h-8 px-4 bg-black text-white hover:bg-gray-800 rounded text-xs font-bold transition"
              >
                Save Workspace
              </button>

            </form>

            {/* Danger Zone */}

            {isOwner && (
              <div className="border border-red-200 bg-red-50/20 rounded-lg p-5 mt-8 max-w-md">

                <h5 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <ShieldAlert size={14} />
                  Danger Zone
                </h5>

                <p className="text-[11px] text-gray-500 mb-4">
                  Permanently delete this organization and remove every member.
                  This action cannot be undone.
                </p>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="h-8 px-4 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition"
                >
                  Delete Organization
                </button>

              </div>
            )}

          </div>
        )}

        {activeTab === "members" && (

          <div className="space-y-6">

            <div>

              <h4 className="text-sm font-bold text-gray-900">
                Organization Members
              </h4>

              <p className="text-xs text-gray-400 mt-1">
                Invite, manage and control member permissions.
              </p>

            </div>

            {isOwner && (

              <form
                onSubmit={handleInvite}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3 max-w-xl"
              >

                <span className="text-xs font-bold text-gray-800 flex items-center gap-2">
                  <UserPlus size={13} />
                  Invite Member
                </span>

                <div className="flex flex-col sm:flex-row gap-3">

                  <input
                    type="email"
                    placeholder="member@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1 h-8 px-3 border border-gray-200 rounded text-xs bg-white focus:outline-none focus:border-black"
                  />

                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="h-8 px-3 border border-gray-200 rounded text-xs bg-white"
                  >
                    <option value="org:member">
                      Member
                    </option>

                    <option value="org:admin">
                      Admin
                    </option>
                  </select>

                  <button
                    type="submit"
                    className="h-8 px-4 bg-black text-white hover:bg-gray-800 rounded text-xs font-bold"
                  >
                    Send Invite
                  </button>

                </div>

              </form>
            )}

            {pendingInvitations.length > 0 && (

              <div className="border border-gray-200 rounded-lg overflow-hidden">

                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold">
                  Pending Invitations
                </div>

                <div className="divide-y divide-gray-100">

                  {pendingInvitations.map((invite) => (

                    <div
                      key={invite.id}
                      className="px-4 py-3 flex items-center justify-between"
                    >

                      <div>

                        <p className="font-semibold text-xs">
                          {invite.emailAddress}
                        </p>

                        <p className="text-[10px] text-gray-400">
                          {invite.role}
                        </p>

                      </div>

                      <span className="text-[10px] font-semibold text-yellow-600">
                        Pending
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            )}
            <div className="border border-gray-200 rounded-lg overflow-hidden">

              <table className="w-full border-collapse">

                <thead>

                  <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-wider text-gray-400">

                    <th className="px-4 py-2 text-left">
                      Member
                    </th>

                    <th className="px-4 py-2 text-left">
                      Role
                    </th>

                    <th className="px-4 py-2 text-right">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {members.map((member) => (

                    <tr
                      key={member.id}
                      className="hover:bg-gray-50 transition"
                    >

                      <td className="px-4 py-3">

                        <div className="flex items-center gap-3">

                          <img
                            src={
                              member.image ||
                              "https://ui-avatars.com/api/?name=" +
                              encodeURIComponent(member.name || "User")
                            }
                            alt={member.name}
                            className="w-9 h-9 rounded-full object-cover border border-gray-200"
                          />

                          <div>

                            <p className="font-semibold text-xs text-gray-900">
                              {member.name}
                            </p>

                            <p className="text-[10px] text-gray-400">
                              {member.email}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-4 py-3">

                        {member.role === "org:owner" ? (

                          <span className="bg-black text-white text-[9px] font-bold uppercase rounded px-2 py-1">
                            Owner
                          </span>

                        ) : (

                          <select
                            value={member.role}
                            onChange={(e) =>
                              handleRoleChange(
                                member.id,
                                e.target.value
                              )
                            }
                            className="border border-gray-200 rounded px-2 py-1 text-xs bg-white"
                          >
                            <option value="org:member">
                              Member
                            </option>

                            <option value="org:admin">
                              Admin
                            </option>

                          </select>

                        )}

                      </td>

                      <td className="px-4 py-3 text-right">

                        {member.id !== membership?.id &&
                          member.role !== "org:owner" && (

                            <button
                              onClick={() =>
                                handleRemoveMember(member.id)
                              }
                              className="text-red-600 hover:text-red-700 font-semibold text-xs"
                            >
                              Remove
                            </button>

                          )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}
        {showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">

      <div className="p-6">

        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <ShieldAlert
            className="text-red-600"
            size={24}
          />
        </div>

        <h2 className="text-lg font-bold">
          Delete Organization
        </h2>

        <p className="text-sm text-gray-500 mt-2 leading-6">
          This action is permanent and cannot be undone.
        </p>

        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">

          <p className="text-sm font-medium text-red-700 mb-2">
            This will permanently delete:
          </p>

          <ul className="text-sm text-red-600 list-disc pl-5 space-y-1">
            <li>Organization</li>
            <li>Uploaded datasets</li>
            <li>Analytics</li>
            <li>AI Insights</li>
            <li>Reports</li>
            <li>Members</li>
            <li>Organization settings</li>
          </ul>

        </div>

        <div className="mt-5">

          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
            Type{" "}
            <span className="font-bold text-black">
              {organization.name}
            </span>{" "}
            to confirm
          </label>

          <input
            value={confirmName}
            onChange={(e) =>
              setConfirmName(e.target.value)
            }
            placeholder={organization.name}
            className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:border-red-500"
          />

        </div>

      </div>

      <div className="flex justify-end gap-3 border-t p-4">

        <button
          onClick={() => {
            setShowDeleteModal(false);
            setConfirmName("");
          }}
          disabled={deleting}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          onClick={handleDeleteOrg}
          disabled={
            confirmName !== organization.name ||
            deleting
          }
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
        >
          {deleting
            ? "Deleting..."
            : "Delete Organization"}
        </button>

      </div>

    </div>
  </div>
)}

      </div>

    </div>

  );

}

