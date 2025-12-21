import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CategoryCreate from './CategoryCreate';
import CategoryList from './CategoryList';

const Category = () => {
    return (
        <div className="flex flex-col md:flex-row gap-4 justify-between">
            <Card className="w-full md:max-w-md rounded-md">
                <CardHeader>
                    <CardTitle>Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <CategoryCreate />
                </CardContent>
            </Card>

            <Card className="w-full rounded-md md:max-w-2xl">
                <CardHeader>
                    <CardTitle>Your Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <CategoryList></CategoryList>
                </CardContent>
            </Card>
        </div >
    )
}

export default Category
