import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log(`Attempting to delete query with ID: ${id}`);

    if (!ObjectId.isValid(id)) {
      console.error(`Invalid ObjectId received: ${id}`);
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('admin-panel');

    const result = await db.collection('contact_queries').deleteOne({ _id: new ObjectId(id) });
    console.log(`Delete operation result:`, result);

    if (result.deletedCount === 0) {
      console.warn(`Query with ID ${id} not found for deletion.`);
      return NextResponse.json({ message: 'Query not found' }, { status: 404 });
    }

    console.log(`Query with ID ${id} deleted successfully.`);
    return NextResponse.json({ message: 'Query deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting query:', error);
    return NextResponse.json({ message: 'Failed to delete query' }, { status: 500 });
  }
}
