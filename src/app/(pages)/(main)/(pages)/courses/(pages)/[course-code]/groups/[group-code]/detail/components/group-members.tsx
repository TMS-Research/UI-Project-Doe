import Image from "next/image";

interface GroupMember {
  id: string;
  name: string;
  role: "admin" | "member";
  avatar: string;
}

interface GroupMembersProps {
  members: GroupMember[];
}

export default function GroupMembers({ members }: GroupMembersProps) {
  return (
    <div className="bg-background rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Group Members</h2>
      <div className="space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center"
          >
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {member.avatar ? (
                <Image
                  src={member.avatar}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-500 font-medium">{member.name.charAt(0)}</span>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{member.name}</p>
              <p className="text-xs text-gray-500 capitalize">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
