import 'package:flutter/material.dart';

void main() {
  runApp(const TodoApp());
}

// ── Model ─────────────────────────────────────────────────────────────────────

class Todo {
  final int id;
  final String item;
  bool completed;

  Todo({required this.id, required this.item, this.completed = false});
}

// ── App ───────────────────────────────────────────────────────────────────────

class TodoApp extends StatelessWidget {
  const TodoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Todos',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF4A6CF7),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      home: const TodoScreen(),
    );
  }
}

// ── Screen ────────────────────────────────────────────────────────────────────

class TodoScreen extends StatefulWidget {
  const TodoScreen({super.key});

  @override
  State<TodoScreen> createState() => _TodoScreenState();
}

class _TodoScreenState extends State<TodoScreen> {
  int _nextId = 6;

  final List<Todo> _todos = [
    Todo(id: 1, item: 'Buy groceries'),
    Todo(id: 2, item: 'Read a book', completed: true),
    Todo(id: 3, item: 'Go for a run'),
    Todo(id: 4, item: 'Call mom', completed: true),
    Todo(id: 5, item: 'Fix that bug'),
  ];

  final _controller = TextEditingController();
  final _focusNode = FocusNode();

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _add() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    setState(() {
      _todos.add(Todo(id: _nextId++, item: text));
    });
    _controller.clear();
    _focusNode.requestFocus();
  }

  void _toggle(Todo todo) {
    setState(() => todo.completed = !todo.completed);
  }

  void _delete(Todo todo) {
    setState(() => _todos.remove(todo));
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final pending = _todos.where((t) => !t.completed).length;
    final total = _todos.length;

    return Scaffold(
      backgroundColor: colors.surface,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Header ──────────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 32, 24, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'My Todos',
                    style: TextStyle(
                      fontSize: 30,
                      fontWeight: FontWeight.w700,
                      color: colors.onSurface,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    total == 0
                        ? 'Nothing here yet'
                        : '$pending of $total remaining',
                    style: TextStyle(
                      fontSize: 13,
                      color: colors.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // ── Input ────────────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      focusNode: _focusNode,
                      onSubmitted: (_) => _add(),
                      style: const TextStyle(fontSize: 15),
                      decoration: InputDecoration(
                        hintText: 'Add a task…',
                        hintStyle: TextStyle(color: colors.onSurfaceVariant),
                        filled: true,
                        fillColor: colors.surfaceContainerHighest,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 14,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  FilledButton(
                    onPressed: _add,
                    style: FilledButton.styleFrom(
                      minimumSize: const Size(52, 52),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: EdgeInsets.zero,
                    ),
                    child: const Icon(Icons.add_rounded),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // ── List ─────────────────────────────────────────────────────
            Expanded(
              child: _todos.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.check_circle_outline_rounded,
                            size: 52,
                            color: colors.onSurfaceVariant,
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'All clear',
                            style: TextStyle(
                              fontSize: 16,
                              color: colors.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.fromLTRB(24, 4, 24, 32),
                      itemCount: _todos.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 8),
                      itemBuilder: (context, i) => _TodoTile(
                        todo: _todos[i],
                        onToggle: () => _toggle(_todos[i]),
                        onDelete: () => _delete(_todos[i]),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Tile ──────────────────────────────────────────────────────────────────────

class _TodoTile extends StatelessWidget {
  final Todo todo;
  final VoidCallback onToggle;
  final VoidCallback onDelete;

  const _TodoTile({
    required this.todo,
    required this.onToggle,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final done = todo.completed;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 180),
      decoration: BoxDecoration(
        color: done
            ? colors.surfaceContainerHighest.withOpacity(0.45)
            : colors.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
        leading: GestureDetector(
          onTap: onToggle,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 180),
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: done ? colors.primary : Colors.transparent,
              border: done
                  ? null
                  : Border.all(color: colors.outline, width: 1.5),
            ),
            child: done
                ? Icon(Icons.check_rounded, size: 14, color: colors.onPrimary)
                : null,
          ),
        ),
        title: Text(
          todo.item,
          style: TextStyle(
            fontSize: 15,
            decoration: done ? TextDecoration.lineThrough : null,
            decorationColor: colors.onSurfaceVariant,
            color: done ? colors.onSurfaceVariant : colors.onSurface,
          ),
        ),
        trailing: IconButton(
          onPressed: onDelete,
          icon: Icon(
            Icons.delete_outline_rounded,
            size: 20,
            color: colors.onSurfaceVariant,
          ),
          tooltip: 'Delete',
        ),
      ),
    );
  }
}