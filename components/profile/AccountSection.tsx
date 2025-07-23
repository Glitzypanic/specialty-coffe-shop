import Image from 'next/image';

interface AccountSectionProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function AccountSection({ user }: AccountSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Gestión de la cuenta</h2>
      <div className="flex items-center gap-4">
        {user.image && (
          <Image
            src={user.image}
            alt="Avatar"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full border"
          />
        )}
        <div>
          <div className="font-semibold text-lg">{user.name}</div>
          <div className="text-gray-600">{user.email}</div>
        </div>
      </div>
      {/* Aquí puedes agregar formularios para editar datos de usuario */}
    </section>
  );
}
