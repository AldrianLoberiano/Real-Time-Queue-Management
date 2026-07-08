import React from 'react';
import { Layout } from '../components/Layout';
import { useQueue } from '../QueueContext';

export function DisplayScreenPage() {
  const { currentlyServing, waitingItems, doneItems } = useQueue();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Queue Display</h1>
          <p className="text-gray-500 text-sm">Live queue status</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6 text-center">
          {currentlyServing ? (
            <>
              <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Now Serving</p>
              <p className="text-9xl font-bold text-sky-600 mb-3 tracking-tight" style={{ fontSize: '8rem' }}>{currentlyServing.number}</p>
              <span className="text-gray-600">{currentlyServing.name}</span>
            </>
          ) : (
            <div className="py-6">
              <p className="text-gray-400 text-lg font-medium">No one being served</p>
              <p className="text-gray-300 text-sm mt-1">Waiting for the next customer</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="font-medium text-gray-800 text-sm">Waiting ({waitingItems.length})</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
              {waitingItems.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">No one waiting</p>
              ) : (
                waitingItems.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50">
                    <span className="text-gray-400 text-xs font-mono w-5">#{idx + 1}</span>
                    <span className="font-semibold text-gray-900">{item.number}</span>
                    <span className="text-gray-500 text-sm flex-1">{item.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="font-medium text-gray-800 text-sm">Recently Served</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
              {doneItems.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">No one served yet</p>
              ) : (
                doneItems.slice(0, 10).map(item => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50">
                    <span className="font-semibold text-gray-900">{item.number}</span>
                    <span className="text-gray-500 text-sm flex-1">{item.name}</span>
                    <span className="text-green-600 text-xs font-medium">Done</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
