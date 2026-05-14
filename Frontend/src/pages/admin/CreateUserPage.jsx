const CreateUserPage = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-inverted)] font-[var(--font-display)]">
            Create User
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Add a new administrator to the system.
          </p>
        </div>
      </div>
      <div className="bg-[var(--color-dark-800)] rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] p-8 border border-[var(--color-border-dark)] text-center text-[var(--color-text-muted)]">
        Create user form will be implemented here.
      </div>
    </div>
  );
};

export default CreateUserPage;
