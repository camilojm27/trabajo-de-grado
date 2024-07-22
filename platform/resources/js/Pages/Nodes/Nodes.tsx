import { Badge } from "@/components/ui/badge.jsx"
import { CardHeader, CardContent, Card } from "@/components/ui/card"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Link} from '@inertiajs/react'
import {User} from "@/types";
import {Node} from "@/types/node"
import { NodesColumns } from "./NodesColumns";
import DataTable from "@/components/app/DataTable";
import { LayoutGrid, Sheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";


interface NodesProps {
    auth: {
        user: User
    }
    nodes: Node[]
}
export default function Nodes({auth, nodes} : NodesProps) {
    const [showDataTable, setShowDataTable] = useState(false);
    console.log(nodes);
    const listItems = nodes.map(node =>
        <Card key={node.id}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{node.name}</h2>
                    {node.isOnline ? (
                        <Badge className="bg-green-200 text-green-800" variant="outline">
                            Online
                        </Badge>                    ) : (
                        <Badge className="bg-red-200 text-red-800" variant="outline">
                            Offline
                        </Badge>
                    )}

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
          header={
              <div className="flex justify-between">
                  <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                      Nodes
                  </h2>
                  {showDataTable ? (
                      <Button onClick={() => setShowDataTable(false)}>
                          Vista en Galeria <LayoutGrid />
                      </Button>
                  ) : (
                      <Button onClick={() => setShowDataTable(true)}>
                          Vista en Tabla <Sheet />
                      </Button>
                  )}
              </div>
          }
      >
          <main className="p-4 md:p-6">
              {showDataTable ? (
                  <DataTable columns={NodesColumns} data={nodes} />
              ) : (
                  <div className="max-w-4xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {listItems}
                      </div>
                  </div>
              )}
          </main>
      </AuthenticatedLayout>
  );
}
