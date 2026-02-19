import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange, itemCounts }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange('all')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeCategory === 'all' ?'bg-primary text-primary-foreground' :'bg-card text-foreground hover:bg-muted border border-border'
        }`}
      >
        <Icon name="Grid" size={16} />
        <span>All Items</span>
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          activeCategory === 'all' ? 'bg-primary-foreground/20' : 'bg-muted'
        }`}>
          {itemCounts?.all}
        </span>
      </button>
      {categories?.map((category) => (
        <button
          key={category?.id}
          onClick={() => onCategoryChange(category?.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeCategory === category?.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-foreground hover:bg-muted border border-border'
          }`}
        >
          <Icon name={category?.icon} size={16} />
          <span className="hidden sm:inline">{category?.name}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            activeCategory === category?.id ? 'bg-primary-foreground/20' : 'bg-muted'
          }`}>
            {itemCounts?.[category?.id] || 0}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;