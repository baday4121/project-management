public function up(): void
{
    Schema::create('notes', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('title')->nullable();
        $table->text('content');
        $table->string('color')->default('#1f2937'); // Default warna dark
        $table->boolean('is_pinned')->default(false);
        $table->timestamps();
    });
}