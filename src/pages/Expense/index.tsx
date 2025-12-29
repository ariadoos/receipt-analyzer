import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ExpenseCreate from './ExpenseCreate';
import ExpensesList from './ExpenseList';

const Expense = () => {
    return (
        <div className="flex flex-col md:flex-row gap-4 justify-between" >
            <Card className="md:max-w-md rounded-md w-full max-h-max" >
                <CardHeader>
                    <CardTitle>Add Expense</CardTitle>
                </CardHeader>
                < CardContent >
                    <ExpenseCreate />
                </CardContent>
            </Card>

            < Card className="rounded-md md:max-w-2xl w-full" >
                <CardHeader>
                    <CardTitle>Your Expenses</CardTitle>
                </CardHeader>
                < CardContent >
                    {<ExpensesList />}
                </CardContent>
            </Card>
        </div >
    )
}

export default Expense
