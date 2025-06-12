interface UserInfoGridProps {
  email?: string | null;
  name?: string | null;
}

export default function UserInfoGrid({ email, name }: UserInfoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900">Email</h3>
        <p className="text-gray-600">{email}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900">Name</h3>
        <p className="text-gray-600">{name}</p>
      </div>
    </div>
  );
}
