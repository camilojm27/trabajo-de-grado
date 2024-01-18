import { Badge } from "@/components/ui/badge.jsx"
import { CardHeader, CardContent, Card } from "@/components/ui/card.jsx"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Link} from '@inertiajs/react'

export default function Nodes({auth, nodes}) {
    const listItems = nodes.map(node =>
        <Card key={node.id}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{node.name}</h2>
                    <Badge className="bg-green-200 text-green-800" variant="outline">
                        Online
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500">Server 3 is currently online and functioning properly.</p>
                <p className="text-sm text-gray-500 mt-2">ID: {node.id}</p>
                <br/>
                <Link href={`/nodes/${node.id}`} className="mt-4 bg-gray-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    View Details
                </Link>
            </CardContent>
        </Card>
    );
  return (
      <AuthenticatedLayout
          user={auth.user}
          header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Nodes</h2>}
      >
          <main className="p-4 md:p-6">
              <div className="max-w-4xl mx-auto">
                  <h1 className="text-xl md:text-2xl font-bold mb-4">Servers Status</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {listItems}
                  </div>
              </div>
          </main>
      </AuthenticatedLayout>
  );
}
