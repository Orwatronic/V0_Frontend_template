"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TreeNodeData {
  id: string
  name: string
  children?: TreeNodeData[]
}

interface TreeNodeProps {
  node: TreeNodeData
  level?: number
  onSelect?: (id: string) => void
  selectedId?: string
}

interface TreeProps {
  data: TreeNodeData[]
  onSelect?: (id: string) => void
  selectedId?: string
  className?: string
}

export const TreeNode: React.FC<TreeNodeProps> = ({ node, level = 0, onSelect, selectedId }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = node.children && node.children.length > 0
  const isSelected = selectedId === node.id

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  const handleSelect = () => {
    onSelect?.(node.id)
  }

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center py-1 px-2 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer",
          isSelected && "bg-accent text-accent-foreground",
          level > 0 && "ml-4",
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 mr-2"
            onClick={handleToggle}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </Button>
        ) : (
          <span className="w-6 mr-2" />
        )}
        <span className="flex-1 text-sm font-medium cursor-pointer" onClick={handleSelect}>
          {node.name}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-2">
          {node.children?.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} onSelect={onSelect} selectedId={selectedId} />
          ))}
        </div>
      )}
    </div>
  )
}

export const Tree: React.FC<TreeProps> = ({ data, onSelect, selectedId, className }) => {
  return (
    <div className={cn("space-y-1", className)} role="tree">
      {data.map((node) => (
        <TreeNode key={node.id} node={node} onSelect={onSelect} selectedId={selectedId} />
      ))}
    </div>
  )
}
