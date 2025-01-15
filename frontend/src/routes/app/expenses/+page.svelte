<script lang="ts">
    import { expenses } from '$lib/stores/expenses';
    import { categories } from '$lib/stores/categories';
    import { onMount } from 'svelte';
    import { Button, ButtonGroup, Card, Spinner, Select } from 'flowbite-svelte';
    import Icon from '@iconify/svelte';
    import ModalViewExpense from '../dashboard/modalViewExpense.svelte';

    let selectedPeriod = $state('all');
    let selectedCategory = $state('all');
    let selectedExpenseId = $state<string | null>(null);
    let modalOpen = $state(false);

    const periods = [
        { id: 'today', label: 'Today' },
        { id: 'week', label: 'This Week' },
        { id: 'month', label: 'This Month' },
        { id: 'year', label: 'This Year' },
        { id: 'all', label: 'All Time' }
    ];

    function filterExpenses(expenses: typeof $expenses.items) {
        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            const now = new Date();
            
            let matchesPeriod = true;
            switch (selectedPeriod) {
                case 'today':
                    matchesPeriod = expenseDate.toDateString() === now.toDateString();
                    break;
                case 'week': {
                    const firstDay = now.getDate() - now.getDay();
                    const startOfWeek = new Date(now.setDate(firstDay));
                    startOfWeek.setHours(0, 0, 0, 0);
                    matchesPeriod = expenseDate >= startOfWeek;
                    break;
                }
                case 'month': {
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    matchesPeriod = expenseDate >= startOfMonth && expenseDate <= endOfMonth;
                    break;
                }
                case 'year': {
                    const startOfYear = new Date(now.getFullYear(), 0, 1);
                    const endOfYear = new Date(now.getFullYear(), 11, 31);
                    matchesPeriod = expenseDate >= startOfYear && expenseDate <= endOfYear;
                    break;
                }
                default: // 'all'
                    matchesPeriod = true;
            }

            const matchesCategory = selectedCategory === 'all' || expense.id_category === selectedCategory;
            return matchesPeriod && matchesCategory;
        });
    }

    onMount(() => {
        expenses.fetchExpenses();
        categories.fetchCategories();
    });
</script>

<div class="p-4">
    <!-- Filter Controls -->
    <div class="mb-6 flex justify-center items-center gap-4">
        <ButtonGroup>
            {#each periods as period}
                <Button
                    color={selectedPeriod === period.id ? "blue" : "light"}
                    on:click={() => selectedPeriod = period.id}
                >
                    {period.label}
                </Button>
            {/each}
        </ButtonGroup>

        <Select 
            class="w-48"
            bind:value={selectedCategory}
        >
            <option value="all">All Categories</option>
            {#each $categories.items as category}
                <option value={category.id_category}>{category.name}</option>
            {/each}
        </Select>
    </div>
</div>

<!-- Loading State -->
{#if $expenses.loading || $categories.loading}
    <div class="flex justify-center items-center h-64">
        <Spinner size="xl" />
    </div>
{:else if $expenses.error}
    <div class="text-center text-red-500">
        {$expenses.error}
    </div>
{:else}
    <!-- Expenses Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {#each filterExpenses($expenses.items) as expense}
            {@const category = $categories.items.find(c => c.id_category === expense.id_category)}
            <Card padding="sm" class="hover:shadow-lg transition-shadow">
                <div class="flex items-start gap-3">
                    {#if category}
                        <div
                            class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                            style:background-color={'#' + category.color + '33'}>
                            <Icon icon={category.id_icon} class="w-6 h-6" />
                        </div>
                    {/if}
                    <div class="flex-grow min-w-0">
                        <h3 class="font-medium text-gray-900 dark:text-white truncate">
                            {expense.name}
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(expense.date).toLocaleDateString()}
                        </p>
                        <p class="text-lg font-semibold mt-1">
                            {expense.amount.toFixed(2)} {expense.id_currency}
                        </p>
                    </div>
                    <div class="flex flex-col gap-2 flex-shrink-0">
                        <Button
                            size="xs"
                            color="light"
                            on:click={() => {
                                selectedExpenseId = expense.id_expense;
                                modalOpen = true;
                            }}
                        >
                            <Icon icon="bi:eye" class="w-4 h-4" />
                        </Button>
                        <Button
                            size="xs"
                            color="red"
                            on:click={() => {
                                if (confirm('Are you sure you want to delete this expense?')) {
                                    expenses.deleteExpense(expense.id_expense);
                                }
                            }}
                        >
                            <Icon icon="bi:trash" class="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        {/each}
    </div>
{/if}

<ModalViewExpense 
    bind:open={modalOpen}
    expenseId={selectedExpenseId}
/>